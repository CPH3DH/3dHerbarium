import { Divider } from '@nextui-org/react'

function Foot() {
  return (
    <footer>
      <div className='w-full h-28 bg-[#004C46] dark:bg-[#212121] flex-col hidden sm:flex'>
        <div className="w-full h-3/5 flex justify-between">
          <div className="mx-8 mt-6">
            <a href="https://humboldt.edu" rel="noopener" target="_blank"><img src="../../../humSvg.svg" className="h-8"></img></a>
          </div>
          <div className="text-white flex mx-8 justify-around items-center mt-5">
            <p className='mx-4'><a href="/about">About</a></p>
            <p className='mx-4'><a href="/contribute">Contribute</a></p>
            <p className='mx-4'><a href="/licensing">License</a></p>
            <p className='ml-4'><a href="/contact">Contact</a></p>
          </div>
        </div>
        <div className='flex w-full justify-center'>
          <Divider className='bg-white w-[calc(100%-64px)]' />
        </div>
        <p className='text-white text-center mt-2'>&#169; 2024 Cal Poly Humboldt Library</p>
      </div>

      <div className='w-full h-28 bg-[#004C46] dark:bg-[#212121] flex flex-col sm:hidden justify-center items-center'>
        <div className='w-full flex justify-between'>
          <div className="mx-2 flex items-center">
            <img src="../../../humSvg.svg" className="h-6"></img>
          </div>
          <div className="text-white grid grid-cols-2">
            <p className='mx-2 text-center'><a href="/about">About</a></p>
            <p className='mx-2 text-center'><a href="/contribute">Contribute</a></p>
            <p className='mx-2 text-center'><a href="/licensing">License</a></p>
            <p className='mx-2 text-center'><a href="/contact">Contact</a></p>
          </div>
        </div>
        <div className='flex w-full justify-center'>
          <Divider className='bg-white w-full mt-2' />
        </div>
        <p className='text-white text-center mt-2'>&#169; 2024 Cal Poly Humboldt Library</p>
      </div>
    </footer>
  )
}

export default Foot;