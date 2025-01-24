from flask import Flask, jsonify
import tensorflow as tf
import pickle
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, f1_score, roc_auc_score, mean_squared_error
import random
from flask_cors import CORS




# Generate advanced meaningful dataset function
def generate_advanced_meaningful_dataset(num_rows=100000, random_state=42):
    np.random.seed(random_state)
    
    # Categorical distributions
    traffic_sources = ["Direct", "Organic Search", "Paid Ads", "Social Media"]
    traffic_probs = [0.3, 0.4, 0.2, 0.1]  

    purchase_history_opts = ["No", "Yes"]
    purchase_history_probs = [0.7, 0.3]

    device_types = ["Mobile", "Desktop", "Tablet"]
    device_probs = [0.6, 0.3, 0.1]

    time_of_day = ["Morning", "Afternoon", "Evening", "Night"]
    time_of_day_probs = [0.2, 0.4, 0.3, 0.1]

    discount_usage_opts = ["No", "Yes"]
    discount_usage_probs = [0.5, 0.5]

    # Core features
    Traffic_Source = np.random.choice(traffic_sources, p=traffic_probs, size=num_rows)
    Time_Spent = np.clip(np.random.normal(loc=8, scale=3, size=num_rows), 1, 30)
    Bounce_Rate = np.clip(np.random.normal(loc=0.4, scale=0.2, size=num_rows), 0, 1)
    Interactions = np.clip(np.random.poisson(lam=5, size=num_rows), 1, 20)
    Visits = np.clip(np.random.normal(loc=3, scale=2, size=num_rows), 1, 10).astype(int)
    Cart_Abandonment_Rate = np.clip(np.random.normal(loc=0.5, scale=0.2, size=num_rows), 0, 1)
    Purchase_History = np.random.choice(purchase_history_opts, p=purchase_history_probs, size=num_rows)
    Device_Type = np.random.choice(device_types, p=device_probs, size=num_rows)
    Time_of_Day = np.random.choice(time_of_day, p=time_of_day_probs, size=num_rows)
    Discount_Usage = np.random.choice(discount_usage_opts, p=discount_usage_probs, size=num_rows)


    Loyalty_Score = np.clip(np.random.normal(loc=5, scale=2, size=num_rows), 0, 10)
    
    
    Noise_Feature_1 = np.random.uniform(0, 1, size=num_rows)
    Noise_Feature_2 = np.random.randint(0, 100, size=num_rows)
    
    data = pd.DataFrame({
        "Traffic_Source": Traffic_Source,
        "Time_Spent_on_Funnel_Stages": Time_Spent,
        "Bounce_Rate": Bounce_Rate,
        "Interactions": Interactions,
        "Number_of_Visits_Before_Conversion": Visits,
        "Cart_Abandonment_Rate": Cart_Abandonment_Rate,
        "Purchase_History": Purchase_History,
        "Device_Type": Device_Type,
        "Time_of_Day": Time_of_Day,
        "Discount_Usage": Discount_Usage,
        "Loyalty_Score": Loyalty_Score,
        "Noise_Feature_1": Noise_Feature_1,
        "Noise_Feature_2": Noise_Feature_2
    })

    # Binary indicators and numeric transformations
    organic_search_indicator = (data["Traffic_Source"] == "Organic Search").astype(int)
    purchase_history_indicator = (data["Purchase_History"] == "Yes").astype(int)
    discount_indicator = (data["Discount_Usage"] == "Yes").astype(int)
    
    # Extract features
    time_spent = data["Time_Spent_on_Funnel_Stages"]
    bounce_rate = data["Bounce_Rate"]
    interactions = data["Interactions"]
    visits = data["Number_of_Visits_Before_Conversion"]
    loyalty = data["Loyalty_Score"]
    
    
    sqrt_interactions = np.sqrt(interactions)
    
    # Coefficients for logistic model
    beta_0 = -2.0
    beta_1 = 0.15
    beta_2 = 1.0
    beta_3 = 0.6
    beta_4 = 0.4
    beta_5 = -1.0
    beta_6 = 0.3
    beta_7 = 0.15
    beta_8 = 0.1
    
    # Calculate linear predictor
    linear_pred = (
        beta_0
        + beta_1 * time_spent
        + beta_2 * purchase_history_indicator
        + beta_3 * discount_indicator
        + beta_4 * organic_search_indicator
        + beta_5 * bounce_rate
        + beta_6 * sqrt_interactions
        + beta_7 * visits
        + beta_8 * loyalty
    )
    
    # Add interaction effects
    organic_discount_interaction = (organic_search_indicator & discount_indicator)
    linear_pred += 0.3 * organic_discount_interaction
    
    high_loyalty = np.maximum(loyalty - 5, 0)
    linear_pred += 0.2 * purchase_history_indicator * high_loyalty
    
    # Sigmoid to get probability
    p = 1 / (1 + np.exp(-linear_pred))
    
    # Generate conversion outcomes
    data["Conversion"] = (np.random.rand(num_rows) < p).astype(int)

    return data

# Load the model and preprocessors
model = tf.keras.models.load_model("saved_model/my_model.keras")
with open("saved_model/label_encoders.pkl", "rb") as f:
    label_encoders = pickle.load(f)
with open("saved_model/scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

app = Flask(__name__)
CORS(app)

@app.route("/simulate", methods=["GET"])
def simulate():
    try:
        # Randomly choose the number of users (between 10,000 and 200,000)
        num_rows = random.randint(10000, 200000)
        data = generate_advanced_meaningful_dataset(num_rows=num_rows)
        features = data.drop("Conversion", axis=1)
        target = data["Conversion"]

        # Encode and scale features
        for col, encoder in label_encoders.items():
            if col in features:
                features[col] = encoder.transform(features[col])
        features_scaled = scaler.transform(features)

        # Make predictions
        predictions = model.predict(features_scaled).ravel()
        predicted_classes = (predictions > 0.5).astype(int)

        # Calculate evaluation metrics
        accuracy = accuracy_score(target, predicted_classes)
        precision = precision_score(target, predicted_classes, zero_division=0)
        f1 = f1_score(target, predicted_classes, zero_division=0)
        auc = roc_auc_score(target, predictions)
        mse = mean_squared_error(target, predictions)
        conversion_rate = predicted_classes.mean()
        tp = int(((predicted_classes == 1) & (target == 1)).sum())
        fp = int(((predicted_classes == 1) & (target == 0)).sum())

        # Convert DataFrame to list of dictionaries for JSON serialization (return 1,000 rows)
        data_json = data.head(1000).to_dict(orient="records")  # Return 1,000 rows

        # Return metrics and predictions
        return jsonify({
            "number_of_users_simulated": int(num_rows),
            "conversion_rate": float(conversion_rate),
            "accuracy": float(accuracy),
            "precision": float(precision),
            "f1_score": float(f1),
            "auc": float(auc),
            "mse": float(mse),
            "true_positives": tp,
            "false_positives": fp,
            "sample_data": data_json
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

