import {withStatusBar} from '@/hocs';
import {EmailVerificationScreen as EmailVerification} from './EmailVerificationScreen';
import {ForgotPasswordScreen as ForgotPassword} from './ForgotPasswordScreen';
import {HomeScreen as Home} from './HomeScreen';
import {SignInScreen as SignIn} from './SignInScreen';
import {SignUpScreen as SignUp} from './SignUpScreen';
import {WelcomeScreen as Welcome} from './WelcomeScreen';

export const EmailVerificationScreen = withStatusBar(EmailVerification);
export const ForgotPasswordScreen = withStatusBar(ForgotPassword);
export const HomeScreen = withStatusBar(Home);
export const SignInScreen = withStatusBar(SignIn);
export const SignUpScreen = withStatusBar(SignUp);
export const WelcomeScreen = withStatusBar(Welcome);
