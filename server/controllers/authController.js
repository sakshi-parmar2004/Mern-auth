import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../modals/userModel.js";
import { transporter } from "../config/nodemailer.js";

import { EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE } from "../../client/src/assets/emailTemplates.js";


export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    //Sending mail
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: email,
      subject: "Welcome to mern Auth",
      text: "Hey Welcome to the mern Authentication app here we learn and grow",
    };
    await transporter.sendMail(mailOptions);
    res.send({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const User = await userModel.findOne({ email });
    if (!User) {
      res.json({ success: false, message: "Invalid Account" });
    }

    const isPassword = await bcrypt.compare(password, User.password);
    if (!isPassword) {
      res.json({ success: false, message: "Wrong Password" });
    }
    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Logged in" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, mesage: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ succes: true, message: "Logged Out" });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, mesage: error.message });
  }
};

export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const user = await userModel.findOne( {_id:userId} );
     console.log(user);
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const Otp = String(Math.floor(10000 + Math.random() * 9000));
    user.verifyOtp = Otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 10000;
    await user.save();
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: user.email,
      subject: "Verification OTP",
      // text: `The verification otp is ${Otp}`,
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", Otp).replace("{{email}}", user.email)
    };
    await transporter.sendMail(mailOptions);
    res.send({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, mesage: error.message });
  }
};

export const verifyEmail = async (req,res) => {
  const {userId, otp} = req.body;
  if(!userId || !otp)
  {
   return  res.json({succes:false,message:"Missing Details"});
  }

  try {
   
    const user = await userModel.findOne({ _id: userId });
    if(!user)
     {
      return res.json({succes:false,message:"User Not found"});
     }
     if( user.verifyOtp ==='' || otp !== user.verifyOtp )
     {
      res.json({success:false,message:"Wrong OTP entered"})
     }
     if( user.verifyOtpExpireAt<Date.now())
     {
      res.json({success:false,message:"Otp expired"})
     }

     user.isAccountVerified=true;
     user.verifyOtp = '';
     user.verifyOtpExpireAt=0;

     await user.save();
     res.json({success:true,message:"Succesfully Verified"});
    
  } catch (error) {
    console.log(error.message);
    res.json({ succes: false, mesage: error.message });

    
  }
}

export const isAuthenticated = (req,res)=>
{
   try {
    res.json({success:true, message:"Succesfully Autheticated"});

   } catch (error) {
    console.log(error.message);
    res.json({ succes: false, mesage: error.message });
   }
}

export const sendResetOtp = async(req,res)=>
{
  console.log("RAW BODY:", req.body);

  if (!req.body) {
    return res.json({ success: false, message: "Request body missing" });
  }

  const { email } = req.body ;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

   
    try {
      const user = await userModel.findOne({email});
      if(!user)
      {
         return res.json({ success: false, mesage: "User Not Found"});

      }
      const Otp = String(Math.floor(10000 + Math.random() * 9000));
      user.resetOtp = Otp;
      user.resetOtpExpireAt = Date.now() + 15* 60 * 10000;
      await user.save();
      const mailOptions = {
        from: process.env.SMTP_SENDER,
        to: email,
        subject: "Reset OTP",
        text: `The Reset otp is ${Otp}`,
        html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", Otp).replace("{{email}}", user.email)
      };
      await transporter.sendMail(mailOptions);
      res.send({ success: true , message:"Reset Otp Sent" });
  
      
    } catch (error) {
      console.log(error.message);
     return res.json({success:false, message:error.message});
    }

}

export const resetPassword = async(req,res)=>
{

  const{ email, otp, newpassword} = req.body;

  if (!email || !otp || !newpassword) {
    return res.json({ success: false, message: "Missing required fields" });
  }
  try {

    const user = await userModel.findOne({email});
    if(!user)
    {
      return res.json({success:false,message:"Invalid user"});
    }

    if(user.resetOtp==='' || user.resetOtp!== otp)
    {
      return res.json({success:false,message:"Wrong Otp"});

    }

    if(user.resetOtpExpireAt < Date.now())
    {
      return res.json({success:false,message:"Expired Otp"});

    }

     const hashedPassword = await bcrypt.hash(newpassword,10);

     user.password=hashedPassword;
     user.resetOtp='';
     user.resetOtpExpireAt=0;
     await user.save();
     res.json({success:true,message:"Succesfully Reset Password"});
    
  } catch (error) {
    console.log(error.message);
    res.json({success:false,message:error.message});
  }



}