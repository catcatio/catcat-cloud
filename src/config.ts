export const config: IConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
}

export interface IConfig {
  port: number
}
