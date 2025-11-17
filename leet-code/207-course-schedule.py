from collections import deque
import signal
from typing import List


class TimeoutException(Exception):
    pass


def handler(signum, frame):
    raise TimeoutException("Execution exceeded 12 seconds.")


signal.signal(signal.SIGALRM, handler)
signal.alarm(12)  # Set the timer for 12 seconds


class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:

        # graph = {}
        # for prerequisite in prerequisites:
        #     if prerequisite[0] not in graph:
        #         graph[prerequisite[0]] = []
        #     graph[prerequisite[0]].append(prerequisite[1])

        graph = {}
        for i in range(numCourses):
            graph[i] = []
        for a, b in prerequisites:
            graph[a].append(b)
        print(graph)
        in_degree = {node: 0 for node in range(numCourses)}
        print(in_degree)
        for node in graph:
            for neighbor in graph[node]:
                in_degree[neighbor] += 1

        queue = deque([node for node in graph if in_degree[node] == 0])

        result = []

        while queue:
            node = queue.popleft()
            result.append(node)

            for neighbor in graph[node]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)

        if len(result) != len(graph):
            return False
        return True

    def canFinish2(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        map = {}
        for prerequisite in prerequisites:
            # print(prerequisite, list(reversed(prerequisite)))
            if list(reversed(prerequisite)) in prerequisites:
                # print("Cycle detected:", prerequisite, list(reversed(prerequisite)))
                return False

        # [a, b] -> take b
        for prerequisite in prerequisites:
            if prerequisite[0] not in map:
                map[prerequisite[0]] = prerequisite[1]
            if prerequisite[0] in map.values():
                for k, v in map.items():
                    if v == prerequisite[0]:
                        map[k] = prerequisite[1]
                        if map[k] == k:
                            return False
        for k, v in map.items():
            if v in map.keys() and map[v] == k:
                return False

        print("Final map:", map)
        return True


try:
    print(Solution().canFinish(2, [[1, 0]]), "\n", True)
    print(Solution().canFinish(2, [[1, 0], [0, 1]]), "\n", False)
    print(Solution().canFinish(3, [[1, 0], [0, 2], [2, 1]]), "\n", False)
    print(Solution().canFinish(
        4, [[0, 1], [2, 3], [1, 2], [3, 0]]), "\n", False)
    print(Solution().canFinish(
        4, [[0, 1], [1, 2], [0, 3], [3, 0]]), "\n", False)

except TimeoutException as e:
    print(e)
    exit(1)
finally:
    signal.alarm(0)  # Disable the alarm
