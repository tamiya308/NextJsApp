interface Props {
  isActive: boolean;
}

const ProfileIcon = ({ isActive }: Props) => {
  return (
    <svg
      className={`h-24 w-24 rounded-full border-2 p-4 transition-colors ${
        isActive
          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
          : 'border-gray-400 bg-gray-400/10 text-gray-400'
      }`}
      viewBox="0 0 24 24"
      fill="currentColor"
      role="img"
      aria-label={isActive ? 'Active user' : 'Inactive user'}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
    </svg>
  )
}

export default ProfileIcon
