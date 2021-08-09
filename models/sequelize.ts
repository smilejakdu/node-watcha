import { Sequelize } from 'sequelize';
import config from '../config/config';

const env = process.env.NODE_ENV as ('production' | 'test' | 'development') || 'development';
console.log("env : ",env);
console.log("env : ",config[env]);
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

export { sequelize };
export default sequelize;