import api from "./api";

export const AccountService = {


getCurrencies(page: number = 1, pageSize: number = 10, search: string = "") {

  return api.get(`/Account/currency?page=${page}&pageSize=${pageSize}&search=${search}`);
},

CreateCurrency(data: any) {  
    //console.log("Creating user with data:", data);
    return api.post("/Account/currency", data);
  },

    updateCurrency(id: string, data: any ) {
  return api.put(`/Account/currency/${id}`, data);
},

  deleteCurrency(id: string) {
    return api.delete(`/Account/currency/${id}`);
  },
 
};