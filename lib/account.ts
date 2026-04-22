// 1. Ka saar kuwan waayo looma baahna (waxay keeni karaan error dhanka build-ka)
// import { rawListeners } from "process"; 
// import { data } from "framer-motion/m";
// import { get } from "http";

import api from "./api";

export const AccountService = {

  // --- CURRENCY ---
  getCurrencies(page: number = 1, pageSize: number = 10, search: string = "") {
    return api.get(`/Account/currency?page=${page}&pageSize=${pageSize}&search=${search}`);
  },

  CreateCurrency(data: any) {  
    return api.post("/Account/currency", data);
  },

  updateCurrency(id: string, data: any) {
    return api.put(`/Account/currency/${id}`, data);
  },

  deleteCurrency(id: string) {
    return api.delete(`/Account/currency/${id}`);
  },

  // --- EXCHANGE RATE ---
  getExchangeRates(page: number = 1, pageSize: number = 10, search: string = "") {
    return api.get(`/Account/exchange-rate?page=${page}&pageSize=${pageSize}&search=${search}`);
  },

  CreateExchangeRate(data: any) {
    return api.post("/Account/exchange-rate", data);
  },

  updateExchangeRate(id: string, data: any) {
    return api.put(`/Account/exchange-rate/${id}`, data);
  },

  deleteExchangeRate(id: string) {
    return api.delete(`/Account/exchange-rate/${id}`);
  },

  // --- ACCOUNTS (Hadda waa ay isku mid yihiin magacyada Table-kaaga) ---
  getAccounts(page: number = 1, pageSize: number = 10, search: string = "") {
    return api.get(`/Account/account?page=${page}&pageSize=${pageSize}&search=${search}`);
  },

  createAccount(data: any) {
    return api.post("/Account/account", data);
  },

  updateAccount(id: string, data: any) {
    return api.put(`/Account/account/${id}`, data);
  },

  deleteAccount(id: string) {
    return api.delete(`/Account/account/${id}`);
  },

  // --- TRANSACTIONS ---
  getTransactionHistory(page: number = 1, pageSize: number = 10, search: string = "") {
    return api.get(`/Account/transaction?page=${page}&pageSize=${pageSize}&search=${search}`);
  },

  deleteTransaction(id: string) {
    return api.delete(`/Account/transaction/${id}`);
  },
};

// 2. Tan ku dar si Table-kaaga oo isticmaalaya "SetupService" uusan u soo saarin error
export const SetupService = AccountService;