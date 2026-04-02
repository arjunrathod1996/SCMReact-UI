import { useEffect, useState } from "react";
import PropTypes from "prop-types";

function ProfilePage({ user }) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>; // or handle the case where user is undefined
  }

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-10">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            <small>{email}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

ProfilePage.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
  }),
};

export default ProfilePage;

