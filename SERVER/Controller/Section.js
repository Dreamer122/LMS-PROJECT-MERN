const Section=require("../Models/Section");
const Course=require("../Models/Course");
const SubSection = require("../Models/SubSection");


exports.createSection=async(req,res)=>{
    try{
        // data fetch
        const {sectionName,courseId}=req.body;
        // data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"missing properties"
            })
        }
        // create section
        const newSection=await Section.create({sectionName});
        // add section to course
        const updateCourseDetails=await Course.findByIdAndUpdate(courseId,{$push:{courseContent:newSection._id}},
            {new:true}).populate("courseContent").exec();
        // hw:use populate to replace sections/ subsection both in updateCourseDetails
    // return response
    return res.status(201).json({
        success:true,
        message:"section created successfully",
        data:updateCourseDetails
    })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"error in creating section"
        })

    }
}

// update section handler
exports.updateSection=async(req,res)=>{
try{
// data input 
    const {sectionName,sectionId}=req.body;
    // data validation
    if(!sectionName || !sectionId){
        return res.status(400).json({
            success:false,
            message:"missing properties"
        })
    }
    // update data
    const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
    // return response
    return res.status(200).json({
        success:true,
        message:"section updated succesfully"
    });
}
catch(error){
    return res.status(500).json({
        success:false,
        message:"error in updating Section "
    })
}
}


// DELETE a section
exports.deleteSection = async (req, res) => {
	try {

		const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
		const section = await Section.findById(sectionId);
		console.log(sectionId, courseId);
		if(!section) {
			return res.status(404).json({
				success:false,
				message:"Section not Found",
			})
		}

		//delete sub section
		await SubSection.deleteMany({_id: {$in: section.subSection}});

		await Section.findByIdAndDelete(sectionId);

		//find the updated course and return 
		const course = await Course.findById(courseId).populate({
			path:"courseContent",
			populate: {
				path: "subSection"
			}
		})
		.exec();

		res.status(200).json({
			success:true,
			message:"Section deleted",
			data:course
		});
	} catch (error) {
		console.error("Error deleting section:", error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};   