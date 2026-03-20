function AdminHeader({ setShowPopup, setShowUserPopup }) {
  return (
    <div className="w-full bg-[#2A235A] shadow-md py-4 px-10 flex justify-between items-center">

      <div className="text-lg font-semibold text-white">
        Admin Portal
      </div>

      <div className="flex gap-6">

        <button
          onClick={() => setShowUserPopup(true)}
          className="px-4 py-2 bg-white text-[#56254f] rounded-lg"
        >
          New User
        </button>

        <button
          onClick={() => setShowPopup(true)}
          className="px-4 py-2 bg-white text-[#56254f] rounded-lg"
        >
          New Organization
        </button>

      </div>
    </div>
  );
}

export default AdminHeader;