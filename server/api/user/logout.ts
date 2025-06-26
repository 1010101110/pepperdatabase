import { deleteCookie } from 'h3'
import { useAuth } from '~/composables/auth';

export default defineEventHandler(async (event) => {
  deleteCookie(event,'auth_token')
  return;
})