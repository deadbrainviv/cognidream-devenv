#define DOCTEST_IMPLEMENT_FIXTURE(der, base, func, decorators)                                     \
    namespace {                                                                                    \
        struct der : public base                                                                   \
        {                                                                                          \
            cognidream f();                                                                              \
        };                                                                                         \
        static cognidream func() {                                                                       \
            der v;                                                                                 \
            v.f();                                                                                 \
        }                                                                                          \
        DOCTEST_REGISTER_FUNCTION(DOCTEST_EMPTY, func, decorators)                                 \
    }                                                                                              \
    inline DOCTEST_NOINLINE cognidream der::f()
