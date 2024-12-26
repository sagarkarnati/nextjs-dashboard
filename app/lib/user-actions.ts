'use server';
 
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export type State = {
  errors?: {
    user_name?: string[];
    user_email?: string[];
  };
  message: string | null;
};

const FormSchema = z.object({
  id: z.string(),
  user_name: z.string({
    invalid_type_error: 'Please enter a username.',
  }),
  user_email: z.string({
    invalid_type_error: 'Please enter a email.',
  }),
  date: z.string(),
});
const UpdateUser = FormSchema.omit({ id: true, date: true });
const CreateUser = FormSchema.omit({ id: true, date: true });
 
export async function createUser(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateUser.safeParse({
    user_name: formData.get('user_name'),
    user_email: formData.get('user_email'),
  });
 
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create User.',
    };
  }
 
  // Prepare data for insertion into the database
  const { user_name, user_email} = validatedFields.data;
  const password:string = '123456';
  const hashedPassword:string = await bcrypt.hash(password, 10);
  //const date = new Date().toISOString().split('T')[0];
  const id: string = uuidv4();
 
  // Insert data into the database
  try {
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${id}, ${user_name}, ${user_email}, ${hashedPassword})
    `;
  } catch (error) {
    console.error(error);
    return {
      message: 'Database Error: Failed to Create User.',
    };
  }
 
  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function updateUser(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const validatedFields = UpdateUser.safeParse({
    user_id: formData.get('user_id'),
    user_name: formData.get('user_name'),
    user_email: formData.get('user_email'),
  });
 
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update User.',
    };
  }
 
  const { user_name, user_email } = validatedFields.data;
 
  try {
    await sql`
      UPDATE invoices
      SET name = ${user_name}, email = ${user_email}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Update User.' };
  }
 
  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    revalidatePath('/dashboard/users');
    return { message: 'Deleted User.' };
  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Failed to Delete User.' };
  }
}