export type QueryFindDemanda = {
  centerId: string;
  empresa: string;
  processo: string;
  turno: string;
  cluster: string;
  dataRegistro: string;
};

export type QueryFindUserDashboard = {
  funcionarioId: string;
  centerId: string;
  processo: string;
  turno: string;
  dataRegistro: string;
};
