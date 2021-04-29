// Windows-specific constants

/**
 * The maximum allowed timeout period for the /t param (in seconds, i.e. 10 years).
 * @see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown
 */
export const WINDOWS_MAX_SHUTDOWN_TIMEOUT = 315360000

/**
  * The maximum length for shutdown comments in the /c param (characters).
  * @see https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/shutdown
  */
export const WINDOWS_MAX_SHUTDOWN_COMMENT_LENGTH = 512
