import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeroProps {
  memberName?: string;
  memberImage?: string;
}

const ConversationHero = ({
  memberName,
  memberImage,
}: ConversationHeroProps) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <div className="mx-5 mb-4 mt-[88px]">
      <div className="mb-2 flex items-center gap-x-1">
        <Avatar className="mr-2 size-14">
          <AvatarImage src={memberImage} />

          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <p className="text-2xl font-bold">{memberName}</p>
      </div>

      <p className="mb-4 text-base font-normal text-slate-800">
        This conversation is just between you and <strong>{memberName}</strong>
      </p>
    </div>
  );
};

export default ConversationHero;
