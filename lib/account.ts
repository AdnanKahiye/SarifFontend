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
 



  getTransactionHistory(page: number = 1, pageSize: number = 10, search: string = "") {

  return api.get(`/Account/transaction?page=${page}&pageSize=${pageSize}&search=${search}`);
},


  deleteTransaction(id: string) {
    return api.delete(`/Account/transaction/${id}`);
  },



getBalanceAccountSummary(
  page: number = 1, 
  pageSize: number = 10, 
  search: string = "", 
  fromDate?: string, // Taariikhda bilowga
  toDate?: string,   // Taariikhda dhamaadka
  accountType?: string
) {
  const params = new URLSearchParams({ 
    page: page.toString(), 
    pageSize: pageSize.toString(), 
    search 
  });

  // Ku dar filtarrada haddii ay jiraan
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  if (accountType) params.append("accountType", accountType);

  return api.get(`/Account/balances-summary?${params.toString()}`);
},

getProfitLoss(fromDate?: string, toDate?: string) {
  const params = new URLSearchParams();
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  return api.get(`/Account/profit-loss?${params.toString()}`);
},


getDailyReport(page: number, pageSize: number, fromDate?: string, toDate?: string) {
   return api.get(`/Account/daily-report?page=${page}&pageSize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}`);
},

getProfitDetailLoss(page: number, pageSize: number, fromDate?: string, toDate?: string) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  return api.get(`/Account/profit-loss-detailed?${params.toString()}`);
},


// Si aad u hubiso in URL-ku uu sax yahay:
getAccountStatement(
  id: string, 
  page: number, 
  pageSize: number, 
  entryType?: number | null, 
  fromDate?: string, 
  toDate?: string
) {
  // Waxaan isticmaalayaa URLSearchParams si aan u dhisno query string sax ah
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());
  
  if (entryType !== undefined && entryType !== null) {
    params.append("entryType", entryType.toString());
  }
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);
  // ID-ga wuxuu ku jiraa URL-ka (path parameter), inta kalena waa query params
  return api.get(`/Account/account-statement/${id}?${params.toString()}`);
},


getAccountsLookup(){
    return api.get("/Account/accounts-lookup");
  },

getAccountExchangeLookup(){
    return api.get("/Account/account-exchange-lookup");
  },


  getCurrencyLookup(){
    return api.get("/Account/currency-lookup");
  },



    createExchange(data: any) {   
      alert(JSON.stringify(data)); 
    //console.log("Creating user with data:", data);
    return api.post("/Account/transaction", data);
  },

  // Ku dar method-kaan gudaha AccountService
  getExchanges(
    page: number = 1, 
    pageSize: number = 10, 
    fromDate?: string, 
    toDate?: string
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);

    return api.get(`/Account/exchanges?${params.toString()}`);
  },

  
    updateExchange(id: string, data: any ) {
  return api.put(`/Account/exchange/${id}`, data);
},

};