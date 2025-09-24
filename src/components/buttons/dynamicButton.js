"use client";
import { useRouter } from "next/navigation";
import Button from "@/components/buttons/buttons";
import { useData } from "@/helper/dataProvider";

const DynamicButton = ({ data, hrefBase, label, icon: Icon, onClick ,theme}) => {
    const router = useRouter();
    const { setSharedData } = useData() || {};

    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }

        if (setSharedData) setSharedData(data);
        console.log(data);

        if (hrefBase) {
            router.push(`${hrefBase}`);
            console.log(hrefBase);
        }
    };

    return (
        <Button
            onClick={handleClick}
            theme={theme? theme : `w-full py-3 bg-gradient-to-r ${data?.color ?? "from-pink-500 to-purple-600"} text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-2`}
            label={
                <span className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
                    <span>{label}</span>
        </span>
            }
        />
    );
};

export default DynamicButton;