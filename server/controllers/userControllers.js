import userModel from "../modals/userModel.js";

export const getData = async(req,res)=>
{
    const {userId} = req.body;
  console.log(userId)

    try {
        const user = await userModel.findOne({_id:userId});

    if(!user)
    {
        return res.json({sucess:false ,message:"Invalid User"})
    }

   return res.json({success:true, userData:{
        name: user.name,
        isAccountVerfied:user.isAccountVerified
    }})
        
    } catch (error) {
        console.log(error.message);
       return res.json({success:false,message:error.message});
        
    }
    

}