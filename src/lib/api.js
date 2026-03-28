import http from "./http";

async function request(path, options = {}) {
  const method = (options.method || "GET").toLowerCase();
  const res = await http.request({
    url: path,
    method,
    data: options.body,
    params: options.params,
  });
  return res.data;
}

export const api = {
  login(data) {
    return request("/auth/login", { method: "POST", body: data });
  },
  register(data) {
    return request("/auth/register", { method: "POST", body: data });
  },
  getMe() {
    return request("/auth/me");
  },
  verifyEmail(token) {
    const params = token ? { token } : undefined;
    return request("/auth/verify-email", { params });
  },
  listMeters() {
    return request("/meters").then((res) => res?.data ?? res);
  },
  getMeter(meterNumber) {
    return request(`/meters/${meterNumber}`).then((res) => res?.data ?? res);
  },
  updateMeterConfig(meterNumber, data) {
    return request(`/meters/${meterNumber}/config`, { method: "PATCH", body: data });
  },
  applyQaElectricity(meterNumber, data) {
    return request(`/meters/${meterNumber}/apply-qa-electricity`, {
      method: "POST",
      body: data,
    });
  },
  validateMeter(data) {
    return request("/meters/validate", { method: "POST", body: data });
  },
  validateIkeja(data) {
    return request("/meters/validate/ikedc", { method: "POST", body: data });
  },
  purchase(data) {
    return request("/payments/purchase", { method: "POST", body: data }).then(
      (res) => res?.data ?? res
    );
  },
  submitOtp(data) {
    return request("/payments/otp", { method: "POST", body: data }).then(
      (res) => res?.data ?? res
    );
  },
  paymentStatus() {
    return request("/payments").then((res) => {
      if (res?.data?.transactions) return res.data.transactions;
      if (res?.transactions) return res.transactions;
      return res?.data ?? res ?? [];
    });
  },
  listTransactions() {
    return request("/payments").then((res) => {
      if (res?.data?.transactions) return res.data.transactions;
      if (res?.transactions) return res.transactions;
      return res?.data ?? res ?? [];
    });
  },
  storeAuthData(data) {
    return request("/payments/auth-data", { method: "POST", body: data });
  },
  setTopupAmount(data) {
    return request("/payments/topup-amount", { method: "POST", body: data });
  },
  fetchPayment(id) {
    return request(`/payments/${id}`).then((res) => res?.data ?? res);
  },
  markPaymentFailed(id, data) {
    return request(`/payments/${id}/mark-failed`, { method: "POST", body: data });
  },
  generateToken(data) {
    return request("/payments/token", { method: "POST", body: data });
  },
  sendCreditUpdate(data) {
    return request("/iot/credit-update", { method: "POST", body: data });
  },
};
