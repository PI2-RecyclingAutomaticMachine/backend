import Bottle from '../models/bottle';

export default {
  model: Bottle,
  items: [
    {
      id: 'coca600',
      wheight: 600,
      label: 'Coca-Cola 600mL',
      material: 'plastico',
    },
    {
      id: 'coca290',
      wheight: 290,
      label: 'Coca-Cola 290mL',
      material: 'vidro',
    },
    {
      id: 'coca2000',
      wheight: 2000,
      label: 'Coca-Cola 2L',
      material: 'plastico',
    },
    {
      id: 'coca1000',
      wheight: 1000,
      label: 'Coca-Cola 1L',
      material: 'vidro',
    },
  ],
};
