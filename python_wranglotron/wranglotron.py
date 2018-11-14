import pandas as pd
import numpy as np

def make_to_gbr(data, save = False):
    subset = data[data["iso_d"] == "GBR"]
    if save:
        subset.to_csv("../data/to_gbr.csv")
    return subset

def make_from_gbr(data, save = False):
    subset = data[data["iso_o"] == "GBR"]
    if save:
        subset.to_csv("../data/from_gbr.csv")
    return subset

def make_family_gbr(data, save = False):
    subset = data[data["family"] == "GBR"]
    if save:
        subset.to_csv("../data/family_gbr.csv")
    return subset

def make_filtered(data, save = False):
    pass

def get_stats(data):
    print("Mean: ", np.mean(data['flow']))
    print("Variance: ", np.var(data['flow']))

if __name__ == "__main__":
    data = pd.read_stata("../data/col_regfile09.dta")
    print("From GBR")
    get_stats(make_from_gbr(data))
    print("To GBR")
    get_stats(make_to_gbr(data))
