import { jest } from '@jest/globals'

const Sequelize = jest.fn()
jest.mock('sequelize', () => ({
  Sequelize,
  DataTypes: {
    STRING: 'STRING',
    DATE: 'DATE'
  }
}))

const { AuthenticateDatabase } = await import(
  '../../app/data-sources/authenticate/AuthenticateDatabase.js'
)

describe('AuthenticateDatabase', () => {
  test('creates two Sequelize instances', () => {
    Sequelize.mockImplementation(() => ({
      define: jest.fn(),
      query: jest.fn()
    }))

    // eslint-disable-next-line no-new
    new AuthenticateDatabase()

    const dbOptions = {
      host: 'AUTHENTICATE_DB_HOST',
      database: 'AUTHENTICATE_DB_SCHEMA',
      dialect: 'mssql',
      dialectOptions: { options: { encrypt: false } },
      logging: false
    }

    expect(Sequelize).toHaveBeenCalledWith({
      ...dbOptions,
      username: 'AUTHENTICATE_DB_USERNAME',
      password: 'AUTHENTICATE_DB_PASSWORD'
    })

    expect(Sequelize).toHaveBeenCalledWith({
      ...dbOptions,
      username: 'AUTHENTICATE_DB_USERNAME_AUDIT_WRITE',
      password: 'AUTHENTICATE_DB_PASSWORD_AUDIT_WRITE'
    })
  })

  test('should create Answer model', () => {
    const defineMock = jest.fn()
    Sequelize.mockImplementation(() => ({
      define: defineMock,
      query: jest.fn()
    }))

    // eslint-disable-next-line no-new
    new AuthenticateDatabase()

    expect(defineMock).toHaveBeenCalledWith('Answers', {
      CRN: { primaryKey: true, type: 'STRING' },
      Date: 'STRING',
      Event: 'STRING',
      Location: 'STRING',
      Updated: 'DATE',
      UpdatedBy: 'STRING'
    })
  })

  test('should create audit record when getting answers', async () => {
    const queryMock = jest.fn()
    Sequelize.mockImplementation(() => ({
      define: () => ({ findOne: jest.fn() }),
      query: queryMock
    }))

    jest.useFakeTimers().setSystemTime(new Date('2024-08-28T00:00:00.000Z'))

    const db = new AuthenticateDatabase()
    await db.getAuthenticateQuestionsAnswersByCRN('mockCrn', 'mockEmployeeId')

    expect(queryMock).toHaveBeenCalledWith(
      `
      INSERT INTO Audits ([Date], [User], [Action], [Value])
      VALUES(?, ?, ?, ?);
    `,
      {
        replacements: [
          '2024-08-28T00:00:00.000Z',
          'mockEmployeeId',
          'Search',
          'mockCrn'
        ]
      }
    )
  })

  test('should findOne using the Answer model', async () => {
    const mockFindOne = jest.fn()
    Sequelize.mockImplementation(() => ({
      define: () => ({ findOne: mockFindOne }),
      query: jest.fn()
    }))

    const db = new AuthenticateDatabase()
    await db.getAuthenticateQuestionsAnswersByCRN('mockCrn', 'mockEmployeeId')

    expect(mockFindOne).toHaveBeenCalledWith({
      attributes: ['CRN', 'Date', 'Event', 'Location', 'Updated'],
      where: { CRN: 'mockCrn' }
    })
  })

  test('should return answers', async () => {
    Sequelize.mockImplementation(() => ({
      define: () => ({ findOne: async () => 'mockAnswers' }),
      query: jest.fn()
    }))

    const db = new AuthenticateDatabase()
    const answers = await db.getAuthenticateQuestionsAnswersByCRN('mockCrn', 'mockEmployeeId')

    expect(answers).toEqual('mockAnswers')
  })
})
