import { createConnection, getConnectionOptions, Connection } from 'typeorm';

export default async (name = 'default'): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      url:
        process.env.NODE_ENV === 'test'
          ? 'postgres://entpbcbt:nk53unv2jkRCF3AZTtb2ko_HEu7-Kzhw@chunee.db.elephantsql.com/entpbcbt'
          : defaultOptions.database,
    }),
  );
};
