"""
Solution to the population problem:
Town A's population last year was 70,000. This year its population became 74,725.
The male population increased by 5% and the female population increased by 7%.
How many males were there last year in town A?
"""

def solve_population_problem():
    # Given information
    last_year_total = 70000
    this_year_total = 74725
    male_increase_rate = 0.05  # 5%
    female_increase_rate = 0.07  # 7%
    
    # Let's denote:
    # M = number of males last year
    # F = number of females last year
    
    # We have two equations:
    # 1) M + F = 70,000
    # 2) M(1.05) + F(1.07) = 74,725
    
    # From equation 1: F = 70,000 - M
    # Substituting into equation 2:
    # M(1.05) + (70,000 - M)(1.07) = 74,725
    # 1.05M + 74,900 - 1.07M = 74,725
    # -0.02M = 74,725 - 74,900
    # -0.02M = -175
    # M = 175 / 0.02
    # M = 8,750
    
    males_last_year = 8750
    females_last_year = last_year_total - males_last_year
    
    # Verification
    males_this_year = males_last_year * (1 + male_increase_rate)
    females_this_year = females_last_year * (1 + female_increase_rate)
    total_this_year = males_this_year + females_this_year
    
    print("Solution:")
    print(f"Last year's population: {last_year_total:,}")
    print(f"This year's population: {this_year_total:,}")
    print()
    print(f"Males last year: {males_last_year:,}")
    print(f"Females last year: {females_last_year:,}")
    print()
    print("Verification:")
    print(f"Males this year: {males_last_year:,} × 1.05 = {males_this_year:,.0f}")
    print(f"Females this year: {females_last_year:,} × 1.07 = {females_this_year:,.0f}")
    print(f"Total this year: {males_this_year:,.0f} + {females_this_year:,.0f} = {total_this_year:,.0f}")
    print(f"Expected total: {this_year_total:,}")
    print()
    if abs(total_this_year - this_year_total) < 0.01:
        print("✓ Verification successful!")
    else:
        print("✗ Verification failed!")
    
    print(f"\nAnswer: {males_last_year:,} males (Option D)")
    
    return males_last_year

if __name__ == "__main__":
    result = solve_population_problem()