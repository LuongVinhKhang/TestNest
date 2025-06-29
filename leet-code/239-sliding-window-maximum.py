# Input: nums = [1,3,-1,-3,5,3,6,7], k = 3
# Output: [3,3,5,5,6,7]
# Explanation:
# Window position                Max
# ---------------               -----
# [1  3  -1] -3  5  3  6  7       3
#  1 [3  -1  -3] 5  3  6  7       3
#  1  3 [-1  -3  5] 3  6  7       5
#  1  3  -1 [-3  5  3] 6  7       5
#  1  3  -1  -3 [5  3  6] 7       6
#  1  3  -1  -3  5 [3  6  7]      7

from collections import deque
from typing import List
import signal


class TimeoutException(Exception):
    pass


def handler(signum, frame):
    raise TimeoutException("Execution exceeded 12 seconds.")


signal.signal(signal.SIGALRM, handler)
signal.alarm(12)  # Set the timer for 12 seconds


class Solution:
    def maxSlidingWindow1(self, nums: List[int], k: int) -> List[int]:
        q = deque()
        result = []

        for i in range(len(nums)):
            # Remove indices out of the current window
            if q and q[0] < i - k + 1:
                q.popleft()

            # Maintain descending order in deque
            while q and nums[q[-1]] < nums[i]:
                q.pop()

            q.append(i)

            # Append max (front of deque) when window is valid
            if i >= k - 1:
                result.append(nums[q[0]])

        return result

    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        l = len(nums)
        if k >= l:
            return [max(nums)]
        # if k == 1:
        #     return nums

        q = deque()
        q.extend(nums[0:k])
        result = []
        result.append(max(q))

        for i in range(l-k):
            current = nums[k + i]
            q.append(current)
            left = q.popleft()
            lastMax = result[-1]
            if current >= lastMax:
                result.append(current)
            else:
                if lastMax > current >= left:
                    result.append(current)
                else:
                    result.append(max(q))

        return result


try:
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    print(Solution().maxSlidingWindow(nums, k), "\n", [3, 3, 5, 5, 6, 7])

    nums = [1, -1]
    k = 1
    print(Solution().maxSlidingWindow(nums, k), "\n", [1, -1])

    nums = [7, 2, 4]
    k = 2
    print(Solution().maxSlidingWindow(nums, k), "\n", [7, 4])

    with open("239-sliding-window-maximum-data.txt") as f:
        nums = [int(x) for x in f.read().split(',') if x.strip()]
    k = 50_000
    (Solution().maxSlidingWindow(nums, k))
except TimeoutException as e:
    print(e)
    exit(1)
finally:
    signal.alarm(0)  # Disable the alarm
