import Header from './Header'

const Layout = ({ children }) => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 container mx-auto px-4 py-4 sm:py-6 lg:py-8' role='main'>
        {children}
      </main>
    </div>
  )
}

export default Layout
