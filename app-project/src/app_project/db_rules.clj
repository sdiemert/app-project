(ns app-project.db-rules
  (:require [grape.core :refer :all]))

(def GTSystem nil)

(defn initalizeGTS
  ([] (initalizeGTS 'app))
  ([sysName] (def GTSystem (gts (symbol sysName) {}))

   (def GTSystem
     (rule 'authenticate? ['user 'pass]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'":name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'password'" :pass"'&pass'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'is-role? ['user 'role]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'":name "'&user'" :role "'&role'"}})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'make-user! ['user 'pass 'role]
           {:read (pattern
                    (node 'rootNode {:asserts {:kind "'root'"}})
                    )

            :create (pattern
                      (node 'n1 {:asserts {:kind "'user'":name "'&user'" :role "'&role'"}})
                      (node 'n2 {:asserts {:kind "'password'" :pass"'&pass'"}})
                      (node 'n3 {:asserts {:kind "'consent'" :value "'null'"}})
                      (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                      (edge 'e2 {:src 'n1 :tar 'n3 :label "consent"})
                    )
            }
           GTSystem
           )
     )

   (def GTSystem
     (rule 'user-exists? ['user]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    )
            }
           GTSystem
           )

     )

   (def GTSystem
     (rule 'delete-user! ['user]
           {:read (pattern
                      (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                      (node 'n2 {:asserts {:kind "'password'"}})
                      (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                    )
            :delete ['n1 'n2 'e1]
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'update-password! ['user 'old 'new]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'password'" :pass "'&old'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "password"})
                    )
            :create  (pattern
                       (node 'n3 {:asserts {:kind "'password'" :pass "'&new'"}})
                       (edge 'e2 {:src 'n1 :tar 'n3 :label "password"})
                       )
            :delete ['n2]
            }
           GTSystem)
     )

   (def GTSystem
     (rule 'update-consent! ['user 'consent]
           {:read (pattern
                    (node 'n1 {:asserts {:kind "'user'" :name "'&user'"}})
                    (node 'n2 {:asserts {:kind "'consent'"}})
                    (edge 'e1 {:src 'n1 :tar 'n2 :label "consent"})
                    )
            :create  (pattern
                       (node 'n3 {:asserts {:kind "'consent'" :value "'&consent'"}})
                       (edge 'e2 {:src 'n1 :tar 'n3 :label "consent"})
                       )
            :delete ['e1 'n2]
            }
           GTSystem)
     )
  )
)