import type { ReactNode } from 'react';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Gift,Share2, Wallet, ArrowRight } from 'lucide-react';

interface CommonComponentProps {
  className?: string;
  children?: ReactNode;
}

const Card = ({className, children}: CommonComponentProps) => {
  return (
    <div className={`w-full sm:w-1/3  bg-card border border-primary-foreground/10 rounded-xl shadow-lg flex flex-col gap-y-4 sm:gap-y-5 px-side-spacing py-6 ${className}`}>
        {children}
    </div>
  )
};

const IconContainer = ({className, children}: CommonComponentProps) => {
  return (
    <span className={`w-fit bg-primary/30 rounded-full p-3 ${className}`}>
        {children}
    </span>
    )
};

const CardTitle = ({className, children}: CommonComponentProps) => {
  return (
    <h3 className={`text-2xl font-bold ${className}`}>{children}</h3>
  )
};

const CardDetail = ({className, children}: CommonComponentProps) => {
  return (
    <p className={`text-card-foreground/60 ${className}`}>{children}</p>
  )
};

const ReferralSection = () => {
  return (
    <section className="w-full min-h-svh bg-background2 flex flex-col justify-center gap-y-10 px-side-spacing py-10">
        {/* Title */}
        <div className='flex flex-col items-center gap-y-4 sm:gap-y-5'>
            <h2 className='text-2xl sm:text-4xl text-card-foreground font-bold'>Earn Money by Sharing Friends</h2>

            <p className='max-w-5/5 sm:max-w-3/5 text-foreground text-center'>Refer your friends and family to Trendzo and earn commission when they make purchase. The more you share, the more you earn!</p>
        </div>

        {/* Cards */}
        <div className='w-full flex flex-col sm:flex-row justify-between gap-6'>
            {/* Share Info */}
            <Card>
                <IconContainer>
                    <Share2 className="text-primary"/>
                </IconContainer>

                <CardTitle>Share Your Link</CardTitle>

                <CardDetail>Get your unique referral link and share it with friends and family across Nepal.</CardDetail>
            </Card>

            {/* Share Info */}
            <Card>
                <IconContainer>
                    <Gift className="text-primary"/>
                </IconContainer>

                <CardTitle>Friend Makes Purchase</CardTitle>

                <CardDetail>When they buy above NPR 2000, you earn NPR 50.</CardDetail>
            </Card>
                       
            {/* You Earn Info */}
            <Card>
                <IconContainer>
                    <Wallet className="text-primary"/>
                </IconContainer>

                <CardTitle>You Earn</CardTitle>

                <CardDetail>Directly withdraw your earnings to your account. No limits!</CardDetail>
            </Card>
        </div>

        {/* Action Button */}
        <div className='w-full flex justify-center'>
            <Button className='text-base sm:text-lg flex flex-row px-8 py-5 sm:px-10 sm:py-6'>
                Start Earning 
                <span>
                    <ArrowRight/>
                </span>
            </Button>
        </div>
    </section>
  )
}

export default ReferralSection