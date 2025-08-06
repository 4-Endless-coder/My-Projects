const counter = document.querySelector('.counter');
const nums = document.querySelectorAll('.nums span');
const finalMsg = document.querySelector('.final');
const replay = document.querySelector('#replay');

runAnimation();

function resetDom() {
    counter.classList.remove('hide');
    finalMsg.classList.remove('show')

    nums.forEach((num)=> {
    nums.classList.value = ''

    })
    nums[0].classList.add('in');

}

function runAnimation(){
    nums.forEach((num, idx)=> {
        const nextToLast = nums.length - 1;

        num.addEventListener('animationend',(e) => {
            if (e.animationName === 'goIn' && idx !== nextToLast) {
              num.nextElementSibling.classList.add('in');  
            } else if (e.animationName === 'goOut' && num.nextElementSibling) {
                num.nextElementSibling.classList.add('in');
            } else{
                counter.classList.add('hide');
                finalMsg.classList.add('show');
            }
        });
    });
}

replay.addEventListener('clik', () => {
    resetDom();
    runAnimation();
});