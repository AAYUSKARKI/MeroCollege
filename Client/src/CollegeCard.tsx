import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from './lib/utils';
import GridPattern from './components/magicui/animated-grid-pattern';
// import { IconAppWindow } from "@tabler/icons-react";
import { BackgroundGradient } from './components/ui/background-gradient';
interface CollegeCardProps {
  college: {
    _id: string;
    name: string;
    imageUrl:string;
    description: string;
  };
}

const truncateText = (text:any, wordLimit:number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {

  const navigate = useNavigate()

  const handleNavigate = (id:string)=>{
    navigate(`/college/${id}`)
  }
  return (
   <>
    <div>
      <BackgroundGradient className="rounded-[22px] p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <img
          src={college.imageUrl}
          alt="jordans"
          className="object-cover h-[400px] w-[400px]"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {college.name}
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
           {truncateText(college.description, 10)}
        </p>
        <button onClick={() => handleNavigate(college._id)} className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>View More</span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            Details
          </span>
        </button>
      </BackgroundGradient>
    </div>
      <GridPattern
        numSquares={30}
        maxOpacity={0.5}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />
   </>
  );
};

export default CollegeCard;
