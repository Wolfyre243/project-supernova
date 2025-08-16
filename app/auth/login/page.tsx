import { login, signup } from './actions';

export default function LoginPage() {
  return (
    <form className='flex flex-col'>
      <div>
        <label htmlFor='email'>Email:</label>
        <input id='email' name='email' type='email' required />
      </div>
      <div>
        <label htmlFor='password'>Password:</label>
        <input id='password' name='password' type='password' required />
      </div>
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
}
