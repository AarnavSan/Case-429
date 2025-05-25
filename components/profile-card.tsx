export default function ProfileCard() {
  return (
    <div className="w-72">
      <div className="bg-[#1eb9fa] rounded-2xl p-6 text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-white">
          <img src="/placeholder.svg?height=96&width=96" alt="Flora Jasmine" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-white">Flora Jasmine</h2>
      </div>
    </div>
  )
}
