import { Account } from "../../types/account";
import { Config } from "../../lib/config";
import { IntegrationId } from "../../types/integrations";
import { CsvConfig } from "../../types/integrations/csv";

import { createObjectCsvWriter } from 'csv-writer'
import { sortBy, groupBy } from "lodash";
import { format, formatISO, parseISO, startOfMonth } from "date-fns";
import { Transaction } from "../../types/transaction";

export class CsvOutputIntegration {

    config: Config
    csvConfig: CsvConfig

    constructor(config: Config) {
        this.config = config
        this.csvConfig = config.integrations[IntegrationId.CSV] as CsvConfig
    }

    public updateAccounts = async (accounts: Account[]) => {
        await this.writeBalances(accounts);
        await this.writeTransactions(accounts);
    }

    private writeBalances = async (accounts: Account[]) => {
        const filename = 'balances.csv';
        const path = `${this.csvConfig.path}/balances.csv`;
        const writer = createObjectCsvWriter({
                path,
                header:this.config.balances.properties
            });
        
        return await writer.writeRecords(accounts);
    }

    private writeTransactions = async(accounts: Account[]) => {
        const transactions = sortBy(accounts.map(account => account.transactions).flat(), 'date')

        // Split transactions by month
        const groupedTransactions = groupBy(transactions, transaction => formatISO(startOfMonth(transaction.date)))

        const byMonth = Object.keys(groupedTransactions).map((dtStr) => this.writeTransactionFile(parseISO(dtStr), groupedTransactions[dtStr]));

        await Promise.all(byMonth);
    }

    private writeTransactionFile = async (month: Date, transactions: Transaction[]) => {
        const filename = `${format(month,'yyyy.MM')}.transactions.csv`;
        const path = `${this.csvConfig.path}/${filename}`;

        const writer = createObjectCsvWriter({
            path,
            header:this.config.transactions.properties
        });
    
        return await writer.writeRecords(transactions);
    }
}