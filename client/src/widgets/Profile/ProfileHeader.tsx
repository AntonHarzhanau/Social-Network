import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar"
import { Button } from "@/shared/components/ui/button"
import { BriefcaseBusiness, GraduationCap, MapPin } from "lucide-react"
import { Link } from "react-router-dom"


const ProfileHeader = () => {
  return (
    <div className="w-full  mx-auto rounded-2xl bg-secondary shadow overflow-hidden">
      {/* Cover */}
      <div className="relative h-32 sm:h-40 bg-linear-to-r from-slate-100 to-amber-200">
        <Button
          variant="secondary"
          size="sm"
          className="absolute right-7 top-7"
        >
          Edit cover
        </Button>

        <Avatar
          className="
        absolute left-4 sm:left-8
        bottom-0 translate-y-1/2
        h-20 w-20 sm:h-28 sm:w-28
        rounded-full border-4 border-white shadow-lg
      "
        >
          <AvatarImage src="" alt="" />
          <AvatarFallback>AH</AvatarFallback>
        </Avatar>
      </div>

      {/* Bottom section */}
      <div
        className="
      flex flex-col sm:flex-row
      justify-between items-start sm:items-center
      gap-3
      px-4 sm:px-8
      pt-12 sm:pt-6 pb-4
    "
      >
        <div className="flex flex-col ml-24 sm:ml-36">
          <h1 className="text-2xl font-bold text-secondary-foreground">
            Антон Горжанов
          </h1>
          <div className=" text-sm text-muted-foreground">
            <div className="flex gap-3">
              <Link to="/profile" >
                <Button
                  variant="link"
                  className="px-0"
                  style={{ paddingInline: 0 }}
                >
                  <MapPin />
                  Minsk
                </Button>
              </Link>

              <Link to="/profile">
                <Button
                  variant="link"
                  className="px-0"
                  style={{ paddingInline: 0 }}
                >
                  <GraduationCap />
                  БГУФК
                </Button>
              </Link>

              <Button
                variant="link"
                className="px-0"
                style={{ paddingInline: 0 }}
              >
                <BriefcaseBusiness />
                Подробнее
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 self-end sm:self-auto">
          <Button size="sm">Edit porfile</Button>
          {/* <Button size="sm">Edit</Button> */}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader
