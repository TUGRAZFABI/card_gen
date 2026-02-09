// app/components/explain-tutorial.tsx
export default function LandingPage() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Revive old childhood memories with Card Gen
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Open popular trading cards packs like POKEMON or MAGIC for free!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Explanation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-300 text-xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reason behind this project 
              </h3>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Collecting trading cards gets more and more popular but there is no solution for passionate collectors to 
                <strong>"cross collect"</strong> from different generes like POKEMON or MAGIC all in one application.
              </p>
              
              <h4 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
                Important Points:
              </h4>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 dark:text-green-300">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">There is no affiliation with the original producers of these cards.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 dark:text-green-300">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">The app is not 100% bug proof and still in development</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-green-600 dark:text-green-300">✓</span>
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">Have fun :)</span>
                </li>
              </ul>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r">
                <p className="text-blue-800 dark:text-blue-200 italic">
                  💡 <strong>Pro Tip:</strong> You can also use the application without any registration by not loggin in you can just use the plain mock user. Or just use some 
                     random non existend email I won't check for corectness.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Tutorial */}
          <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Functionalities
              </h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-300">
                  Get Started
                </h4>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-gray-300">
                    Create an account or login into an existing one.
                    <br/>
                    You could also just start unpacking cards without any limits but they will be loaded into the mock users inventory.
                    <br/>
                    The mock user for just looking at the application is: 
                    </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-300">
                  Get Cards 
                </h4>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-gray-300">
                    Navigate to Get Cards
                    <br />
                    Select a supported pack type from the dropdown menu
                    <br />
                    Open the pack
                    <br />
                    Sell the card for some coins or move it into your inventory
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-300">
                  Search cards
                </h4>
                <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <p className="text-gray-300">
                  Enter youre card which you want to search in the database and select from the autocompletion list.
                  </p>
                </div>
              </div>
            </div>
          
            <div className="mt-8 pt-6 border-t border-gray-700">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
              >
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}