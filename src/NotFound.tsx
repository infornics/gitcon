
   export default function NotFound() {
     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="text-center space-y-4">
           <h1 className="text-6xl font-bold text-gray-900">404</h1>
           <p className="text-xl text-gray-600">Page Not Found</p>
           <a
             href="/"
             className="mt-6 inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-indigo-700"
           >
             Go Back Home
           </a>
         </div>
       </div>
     );
   }
   