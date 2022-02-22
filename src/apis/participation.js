import HttpService from '../services/http.service';

export const checkParticipation = async () => HttpService.get(`/agent/check`);
export const getDispute = async (id) => HttpService.get(`/agent/dispute/${id}`);
export const checkInit = async () => HttpService.get(`/agent/check/init`);
