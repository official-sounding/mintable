import { BaseIntegrationConfig, IntegrationId, IntegrationType } from '../integrations'

export interface CsvConfig extends BaseIntegrationConfig {
  id: IntegrationId.CSV
  type: IntegrationType

  path: string
}

export const defaultImportCsvConfig: CsvConfig = {
  name: '',
  id: IntegrationId.CSV,
  type: IntegrationType.Import,

  path: ''
}

export const defaultExportCsvConfig: CsvConfig = {
  name: '',
  id: IntegrationId.CSV,
  type: IntegrationType.Export,

  path: ''
}
