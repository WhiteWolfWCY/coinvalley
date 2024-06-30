import { Button } from "../ui/button"

const CallToAction = () => {
  return (
    <div className="">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Start Managing Your Finances Today
            </h2>
            <p className="mt-4 text-lg text-green-100">
              Join CoinValley and take control of your financial future.
            </p>
            <div className="mt-8">
              <Button variant="landing">Get started &rarr;</Button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CallToAction