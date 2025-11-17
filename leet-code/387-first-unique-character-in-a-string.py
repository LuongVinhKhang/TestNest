import signal


class TimeoutException(Exception):
    pass


def handler(signum, frame):
    raise TimeoutException("Execution exceeded 12 seconds.")


signal.signal(signal.SIGALRM, handler)
signal.alarm(12)  # Set the timer for 12 seconds


class Solution:
    def firstUniqChar(self, s: str) -> int:
        res = {}
        for i, c in enumerate(s):
            if c in res.keys():
                res[c] = -1
            else:
                res[c] = i

        arr = []
        for k, v in res.items():
            if v != -1:
                arr.append(v)

        return min(arr) if arr else -1


try:
    s = "leetcode"
    print(Solution().firstUniqChar(s), "\n", 0)

    s = "loveleetcode"
    print(Solution().firstUniqChar(s), "\n", 2)

    s = "aabb"
    print(Solution().firstUniqChar(s), "\n", -1)

except TimeoutException as e:
    print(e)
    exit(1)
finally:
    signal.alarm(0)  # Disable the alarm
