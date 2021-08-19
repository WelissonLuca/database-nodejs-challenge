import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  category: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string | undefined;
}
class CreateTransactionService {
  public async execute({
    category,
    title,
    value,
    type,
  }: Omit<Request, 'category_id'>): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoryAlreadyExists = await categoryRepository.findOne({
      title: category,
    });

    if (!categoryAlreadyExists) {
      await categoryRepository.create({
        title: category,
      });
    }

    const findCategory = await categoryRepository.findOne({ title: category });

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > total)
      throw new AppError('Not enough money');

    const newTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: findCategory?.id,
    });

    return newTransaction;
  }
}

export default CreateTransactionService;
