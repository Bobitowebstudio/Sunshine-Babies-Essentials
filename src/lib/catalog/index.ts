import { Product, Category } from '../../types';
import { INITIAL_CATEGORIES } from './categories';
import { MATERNITY_PRODUCTS } from './maternity';
import { BABY_ESSENTIALS_PRODUCTS } from './babyEssentials';
import { BABY_CLOTHING_PRODUCTS } from './babyClothing';
import { BABY_GEAR_PRODUCTS } from './babyGear';
import { FEEDING_NURSING_PRODUCTS } from './feedingNursing';
import { BABY_CARE_PRODUCTS } from './babyCare';
import { MOTHER_CARE_PRODUCTS } from './motherCare';
import { BACK_TO_SCHOOL_PRODUCTS } from './backToSchool';
import { BABY_ACCESSORIES_PRODUCTS } from './babyAccessories';

export {
  INITIAL_CATEGORIES,
  MATERNITY_PRODUCTS,
  BABY_ESSENTIALS_PRODUCTS,
  BABY_CLOTHING_PRODUCTS,
  BABY_GEAR_PRODUCTS,
  FEEDING_NURSING_PRODUCTS,
  BABY_CARE_PRODUCTS,
  MOTHER_CARE_PRODUCTS,
  BACK_TO_SCHOOL_PRODUCTS,
  BABY_ACCESSORIES_PRODUCTS,
};

export const ALL_PRODUCTS: Product[] = [
  ...MATERNITY_PRODUCTS,
  ...BABY_ESSENTIALS_PRODUCTS,
  ...BABY_CLOTHING_PRODUCTS,
  ...BABY_GEAR_PRODUCTS,
  ...FEEDING_NURSING_PRODUCTS,
  ...BABY_CARE_PRODUCTS,
  ...MOTHER_CARE_PRODUCTS,
  ...BACK_TO_SCHOOL_PRODUCTS,
  ...BABY_ACCESSORIES_PRODUCTS,
];
