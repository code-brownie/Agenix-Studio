import pandas as pd
import numpy as np

def generate_advanced_meaningful_dataset(num_rows=10000, random_state=42):
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
    # Intercept (beta_0): -2.0 base low probability
    # Time Spent (beta_1): +0.15 per additional minute
    # Purchase History (beta_2): +1.0 if yes
    # Discount Usage (beta_3): +0.8 if yes
    # Organic Search (beta_4): +0.5
    # Bounce Rate (beta_5): -1.0 per unit increase (high bounce reduces conversion)
    # sqrt(Interactions) (beta_6): +0.3 * sqrt(interactions)
    # Visits (beta_7): +0.15 per visit
    # Loyalty_Score (beta_8): +0.1 per point of loyalty
    #
    # Interaction terms:
    # If (Organic Search == 1 and Discount == 1): +0.3 bonus
    # If Purchase_History == Yes and Loyalty_Score > 5: additional +0.2 * (Loyalty_Score - 5)
    #
    # Device_Type and Time_of_Day have lesser direct effects or none to keep complexity controlled.
    
    beta_0 = -2.0
    beta_1 = 0.15
    beta_2 = 1.0
    beta_3 = 0.8
    beta_4 = 0.5
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
    # Organic + Discount interaction
    organic_discount_interaction = (organic_search_indicator & discount_indicator)
    linear_pred += 0.3 * organic_discount_interaction
    
    # Purchase History + High Loyalty interaction
    high_loyalty = np.maximum(loyalty - 5, 0)  # excess loyalty above 5
    linear_pred += 0.2 * purchase_history_indicator * high_loyalty
    
    # Sigmoid to get probability
    p = 1 / (1 + np.exp(-linear_pred))
    
    # Generate conversion outcomes
    data["Conversion"] = (np.random.rand(num_rows) < p).astype(int)

    return data

# Generate the advanced dataset
df = generate_advanced_meaningful_dataset(num_rows=10000)
print(df.head())
print("Overall Conversion Rate:", df["Conversion"].mean())

# Save the dataset
file_path = "aadvanced_meaningful_funnel_conversion_data.csv"
df.to_csv(file_path, index=False)
print(f"Generated advanced dataset saved to {file_path}")