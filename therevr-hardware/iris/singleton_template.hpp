#ifndef SINGLETONTEMPLATE_HPP_
#define SINGLETONTEMPLATE_HPP_

template <typename classType>
class SingletonTemplate
{
public:
    static classType& instance();

protected:
    static classType* mInstance;

    SingletonTemplate() {}
};

template <typename classType>
classType* SingletonTemplate<classType>::mInstance = 0;


template <typename classType>
classType& SingletonTemplate<classType>::instance()
{
    if (SingletonTemplate::mInstance == 0)
    {
        SingletonTemplate::mInstance = new classType();
    }
    return *(SingletonTemplate::mInstance);
}

#endif /* SINGLETONTEMPLATE_HPP_ */