import { createAdministracaoModule } from '../../modules/administracao/index.js';
import { createAuditoriaModule } from '../../modules/auditoria/index.js';
import { createComercialModule } from '../../modules/comercial/index.js';
import { createOperacionalModule } from '../../modules/operacional/index.js';
import { createRhModule } from '../../modules/rh/index.js';

export const createModuleRegistry = () => {
  const modules = [
    createAdministracaoModule(),
    createComercialModule(),
    createOperacionalModule(),
    createRhModule(),
    createAuditoriaModule(),
  ];

  return {
    list() {
      return modules.map((module) => ({
        key: module.key,
        name: module.name,
        version: module.version,
        description: module.description,
      }));
    },
    registerRoutes(router, context) {
      for (const module of modules) {
        module.registerRoutes(router, context);
      }
    },
  };
};
