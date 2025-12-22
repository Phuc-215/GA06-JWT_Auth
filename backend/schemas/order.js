import z from 'zod';

export default z.object({
  recipient: z.string().min(3, 'Recipent is required'),
  houseNumber: z.string().min(1, 'House number is required'),
  street: z.string().min(1, 'Street is required'),
  provinceId: z.number(),
  wardId: z.number(),
});