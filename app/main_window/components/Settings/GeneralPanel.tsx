import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera } from 'react-iconly';

// SELECTORS
import { selectActiveMailbox } from '../../selectors/mail';

// SERVICE
import Account from '../../../services/account.service';

// ACTION CREATOR
import { updateProfile } from '../../actions/account/account';

// HELPER HOOKS
import useForm from '../../../utils/hooks/useForm';

// INTERNAL COMPONENTS
import SettingsSection from './shared/SettingsSection';

const GeneralPanel = () => {
  const dispatch = useDispatch();
  const mailbox = useSelector(selectActiveMailbox);
  const account = useSelector(state => state.account);
  const [hasAvatar, setHasAvatar] = useState(false);

  const {
    handleSubmit,
    handleChange,
    manualChange,
    resetForm,
    isDirty,
    data: profile,
    errors
  } = useForm({
    initialValues: {
      displayName: account?.displayName ?? '',
      avatar: account?.avatar
    },
    validations: {
      displayName: {
        pattern: {
          value: /^$|^([a-zA-Z0-9\.\-\/]+\s)*[a-zA-Z0-9\.\-\/]+$/, // empty ^$ or string
          message: 'No special characters allowed except for . - / allowed.'
        }
      }
    },
    onSubmit: (data: { avatar: string; displayName: string }) =>
      dispatch(updateProfile(data))
  });

  const upload = async () => {
    const result = await Account.uploadAvatar();

    if (!result.canceled) {
      manualChange('avatar', `data:image/png;base64,${result.data}`);
    }
  };

  const removeAvatar = () => {
    manualChange('avatar', null);
  };

  useEffect(() => {
    if (profile?.avatar?.length > 0) {
      setHasAvatar(true);
    } else {
      setHasAvatar(false);
    }
  }, [profile]);

  return (
    <div className="space-y-6">
      <SettingsSection
        header="Profile"
        description="This information may be displayed publicly so be careful what youshare."
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-white py-6 px-7">
            <div className="grid grid-cols-4 gap-6">
              <div className="relative col-span-2 xl:col-span-4">
                <label
                  htmlFor="display-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  name="display-name"
                  id="display-name"
                  placeholder={mailbox?.address ?? ''}
                  value={profile.displayName || ''}
                  onChange={handleChange('displayName')}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-700 focus:border-purple-700 sm:text-sm"
                />
                {errors.displayName && (
                  <p className="absolute -bottom-4 text-red-400 text-xs pl-2 pt-1">
                    {errors.displayName}
                  </p>
                )}
              </div>

              <div className="col-span-2 pl-4 xl:pl-0 xl:col-span-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Photo
                </label>
                <div className="mt-1 flex items-center">
                  {hasAvatar && (
                    <div className="shadow border border-gray-400/70 rounded-full">
                      <img
                        className="inline-block h-12 w-12 rounded-full"
                        src={profile.avatar}
                        alt=""
                      />
                    </div>
                  )}
                  {!hasAvatar && (
                    <div className="h-12 w-12 rounded-full border-2 flex items-center justify-center">
                      <Camera
                        set="bold"
                        size="large"
                        className="text-gray-300"
                      />
                    </div>
                  )}
                  <div className="ml-4 flex">
                    <button
                      type="button"
                      onClick={upload}
                      className="bg-transparent py-2 px-3 border border-blue-gray-300 rounded-md text-sm font-medium text-blue-gray-900 hover:text-blue-gray-700 focus:outline-none focus:border-blue-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-gray-50 focus:ring-purple-500"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={removeAvatar}
                      className="ml-3 bg-transparent py-2 px-3 border border-transparent rounded-md text-sm font-medium text-blue-gray-900 hover:text-blue-gray-700 focus:outline-none focus:border-blue-gray-300 focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-gray-50 focus:ring-purple-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end py-3 bg-gray-50 text-right px-6 border-t border-gray-300">
            <button
              type="button"
              onClick={resetForm}
              disabled={!isDirty}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-gray-900 disabled:text-gray-300 hover:bg-blue-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className="bg-gradient-to-bl from-purple-600 to-purple-500 disabled:from-gray-300 disabled:to-gray-300 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </SettingsSection>
    </div>
  );
};

export default GeneralPanel;
