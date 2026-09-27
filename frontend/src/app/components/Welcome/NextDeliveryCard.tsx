import Image from "next/image";
import type { NextDeliveryComms } from "@/types";
import { formatPrice } from "@/lib/helpers";
import { Button } from "@/app/components/Shared/Button";
import { FreeGiftBadge } from "@/app/components/Shared/FreeGiftBadge";

const CAT_IMAGE = "/cat.jpg";

type Props = {
  comms: NextDeliveryComms;
};

export function NextDeliveryCard({ comms }: Props) {
  return (
    <article className="relative mt-[26.5px] w-full rounded border border-line bg-surface text-center md:mt-0 md:flex md:min-h-[244px] md:max-w-[752px] md:text-left">
      <div className="relative hidden overflow-hidden rounded-l border-r border-line md:block md:flex-[0_0_45%]">
        <Image
          src={CAT_IMAGE}
          alt=""
          fill
          sizes="(min-width: 768px) 339px, 1px"
          className="object-cover object-[50%_40%]"
        />
      </div>

      <div className="px-4 pt-[37.5px] pb-[29px] md:flex md:flex-1 md:flex-col md:pt-10 md:pr-[30px] md:pb-7 md:pl-4">
        <Image
          src={CAT_IMAGE}
          alt=""
          width={53}
          height={53}
          className="absolute inset-x-0 -top-[26.5px] mx-auto size-[53px] rounded-full border border-avatar-line object-cover object-[50%_35%] md:hidden"
        />
        <h1 className="text-base/[22px] font-bold tracking-design text-balance text-brand md:text-wrap">
          {comms.title}
        </h1>
        <p className="mt-1 text-xs/[17px] font-light tracking-design text-pretty md:max-w-[320px]">
          {comms.message}
        </p>
        <p className="mt-2 text-[13px]/[22px] font-bold tracking-design md:mt-1">
          Total price: {formatPrice(comms.totalPrice)}
        </p>
        <div className="mt-[22px] grid grid-cols-2 gap-4 md:mt-auto md:grid-cols-[repeat(2,minmax(0,175px))] md:pt-6">
          <Button variant="primary">See details</Button>
          <Button variant="secondary">Edit delivery</Button>
        </div>
      </div>

      {comms.freeGift && (
        <>
          <div className="absolute inset-x-0 -bottom-3 mx-auto w-fit md:hidden">
            <FreeGiftBadge angle={5.4} />
          </div>
          <div className="absolute -top-2.5 -right-2.5 hidden md:block">
            <FreeGiftBadge angle={-8} />
          </div>
        </>
      )}
    </article>
  );
}
