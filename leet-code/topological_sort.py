from collections import deque


# from collections import defaultdict, deque

# def has_cycle(graph):
#     # Step 1: Compute in-degrees
#     in_degree = {node: 0 for node in graph}
#     for node in graph:
#         for neighbor in graph[node]:
#             in_degree[neighbor] += 1

#     # Step 2: Enqueue nodes with in-degree 0
#     queue = deque([node for node in graph if in_degree[node] == 0])
#     visited_count = 0

#     while queue:
#         node = queue.popleft()
#         visited_count += 1
#         for neighbor in graph[node]:
#             in_degree[neighbor] -= 1
#             if in_degree[neighbor] == 0:
#                 queue.append(neighbor)

#     # If we visited all nodes, there's no cycle
#     return visited_count != len(graph)

# # Example 1: No cycle
# graph1 = {
#     "A": ["B"],
#     "B": ["C"],
#     "C": []
# }
# print(has_cycle(graph1))  # Output: False

# # Example 2: Has a cycle (C → A)
# graph2 = {
#     "A": ["B"],
#     "B": ["C"],
#     "C": ["A"]
# }
# print(has_cycle(graph2))  # Output: True

'''
How It Works (Kahn’s Algorithm – BFS-style)
Compute the in-degree (number of incoming edges) for all nodes.

Start with nodes that have in-degree = 0 (no dependencies).

Remove the node from the graph and reduce in-degree of its neighbors.

Repeat until all nodes are processed.

'''


def topological_sort(graph):
    print(graph)
    # Step 1: Compute in-degrees
    in_degree = {node: 0 for node in graph}
    print(in_degree)
    for node in graph:
        for neighbor in graph[node]:
            in_degree[neighbor] += 1
    print(in_degree)

    # Step 2: Collect nodes with no incoming edges
    queue = deque([node for node in graph if in_degree[node] == 0])
    print(queue)

    result = []
    print(in_degree, queue, result)
    # Step 3: Process the queue
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
        print(in_degree, queue, result)
    if len(result) != len(graph):
        return "Cycle detected – topological sort not possible"


graph = {
    "A": ["B", "D"],
    "B": ["C"],
    "D": ["C"],
    "C": []
}

graph = {
    "A": ["B"],
    "B": ["C"],
    "C": ["A"]
}

# A -> B
# A -> D
# B -> C
# D -> C
# Output: A B D C or similar valid order
# A B D C
graph = {
    "A": ["C"],
    "B": ["C"],
    "C": ["D"],
    "E": ["D"],
    "D": []
}

topological_sort(graph)
