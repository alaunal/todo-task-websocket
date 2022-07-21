import React, { useRef } from "react";

const RecoveryPassword = () => {
  const newPasswordRef = useRef();

  const handleNewPassword = async () => {};

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="container mx-auto">
        <div className="flex items-center justify-center">
          <div className="card w-2/5 shadow-lg border border-gray-200 bg-white">
            <div className="card-body">
              <h2 className="text-3xl mb-4 font-bold">Recovery Password</h2>

              <div className="form-control w-full">
                <label className="label" htmlFor={"password"}>
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="input input-bordered w-full"
                  ref={newPasswordRef}
                />
              </div>

              <div className="mt-6 flex">
                <span className="block w-full mx-1.5 rounded-md shadow-sm">
                  <button type="button" className="flex w-full btn btn-primary">
                    Change Password
                  </button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPassword;
